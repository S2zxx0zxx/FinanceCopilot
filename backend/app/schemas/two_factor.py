from pydantic import BaseModel, Field


class TwoFactorSetupResponse(BaseModel):
    secret: str
    otpauth_uri: str


class TwoFactorEnableRequest(BaseModel):
    code: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")


class TwoFactorDisableRequest(BaseModel):
    password: str
    code: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")


class TwoFactorVerifyRequest(BaseModel):
    temp_token: str
    code: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")
