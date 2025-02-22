from typing import List

from pydantic import BaseModel, HttpUrl


class Template(BaseModel):
    id: str
    name: str
    description: str
    image_url: HttpUrl


class TemplatesResponse(BaseModel):
    success: bool = True
    templates: List[Template]


class TemplateDataResponse(BaseModel):
    success: bool = True
    yaml: str
    template_id: str
    supportsIcons: bool


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
