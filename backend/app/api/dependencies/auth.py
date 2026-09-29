from fastapi import Header, HTTPException, status
from backend.app.core.config import settings


async def verify_admin_token(x_admin_token: str = Header(None, alias="X-Admin-Token")):
    """
    Verifies that the request has the correct admin token header.
    """
    if not x_admin_token or x_admin_token != settings.ADMIN_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing admin token",
        )
    return True
