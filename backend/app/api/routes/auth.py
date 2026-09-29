import urllib.request
import json
import jwt
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from backend.app.core.config import settings

router = APIRouter(tags=["Authentication"])


class GoogleLoginRequest(BaseModel):
    credential: str  # Google ID token returned from Google Identity Services


class UserProfile(BaseModel):
    email: str
    name: str
    picture: Optional[str] = None
    hd: Optional[str] = None  # Hosted domain, e.g. srmap.edu.in
    role: str = "STUDENT"
    is_srm_student: bool = False


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile


def verify_google_token(credential: str) -> dict:
    """
    Verify Google ID token via Google's tokeninfo endpoint.
    If GOOGLE_CLIENT_ID is configured, ensures aud matches.
    Supports development tokens when client ID is not yet configured.
    """
    # 1. If Google Client ID is configured, strictly verify via Google OAuth API
    if settings.GOOGLE_CLIENT_ID:
        try:
            url = f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}"
            req = urllib.request.Request(url, headers={"User-Agent": "SRMAPWiki-OAuth/1.0"})
            with urllib.request.urlopen(req, timeout=8) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode("utf-8"))
                    if data.get("aud") != settings.GOOGLE_CLIENT_ID:
                        raise HTTPException(status_code=400, detail="Token audience does not match GOOGLE_CLIENT_ID")
                    return data
        except urllib.error.HTTPError as e:
            raise HTTPException(status_code=400, detail="Invalid Google OAuth credential")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Google OAuth verification failed: {str(e)}")

    # 2. If GOOGLE_CLIENT_ID is not configured or in dev mode, decode JWT payload
    try:
        # Try JWT decode with or without verification
        unverified = jwt.decode(credential, options={"verify_signature": False})
        return unverified
    except Exception:
        pass

    # 3. Try parsing base64 json
    try:
        parts = credential.split(".")
        if len(parts) >= 2:
            import base64
            padded = parts[1] + "=" * ((4 - len(parts[1]) % 4) % 4)
            decoded = base64.b64decode(padded).decode("utf-8")
            return json.loads(decoded)
    except Exception:
        pass

    raise HTTPException(status_code=400, detail="Invalid Google OAuth token format")


def create_session_token(user_data: dict) -> str:
    payload = {
        "sub": user_data.get("email"),
        "name": user_data.get("name"),
        "picture": user_data.get("picture"),
        "email": user_data.get("email"),
        "role": user_data.get("role", "STUDENT"),
        "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


@router.post("/auth/google", response_model=AuthResponse)
def login_with_google(request: GoogleLoginRequest):
    """
    Authenticate user using Google OAuth 2.0 Identity Token (from Google Cloud Console).
    """
    google_data = verify_google_token(request.credential)
    email = google_data.get("email", "")
    name = google_data.get("name", "SRM AP Member")
    picture = google_data.get("picture")
    hd = google_data.get("hd")

    is_srm = email.endswith("@srmap.edu.in") or hd == "srmap.edu.in"
    role = "STUDENT"
    if "admin" in email.lower() or email == "admin@srmap.edu.in":
        role = "ADMIN"
    elif is_srm and ("faculty" in email.lower() or "prof" in email.lower()):
        role = "FACULTY"

    user_profile = UserProfile(
        email=email,
        name=name,
        picture=picture,
        hd=hd,
        role=role,
        is_srm_student=is_srm,
    )

    token = create_session_token({
        "email": email,
        "name": name,
        "picture": picture,
        "role": role,
    })

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=user_profile,
    )


@router.get("/auth/me", response_model=UserProfile)
def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Get profile of the currently logged-in user from Bearer token.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        email = payload.get("email", "")
        return UserProfile(
            email=email,
            name=payload.get("name", "SRM AP Member"),
            picture=payload.get("picture"),
            role=payload.get("role", "STUDENT"),
            is_srm_student=email.endswith("@srmap.edu.in"),
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired, please sign in again")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authentication token")
