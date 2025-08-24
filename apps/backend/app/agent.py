from app.config import settings
from portia import (
    Config,
    LogLevel,
    LLMProvider,
    example_tool_registry,
    InMemoryToolRegistry,
)
from portia.open_source_tools.pdf_reader_tool import PDFReaderTool


def create_portia_config():
    google_api_key = settings.GOOGLE_API_KEY
    if not google_api_key:
        raise ValueError("GOOGLE_API_KEY environment variable is required")
    return Config.from_default(
        default_log_level=LogLevel.DEBUG,
        llm_provider=LLMProvider.GOOGLE,
        default_model="google/gemini-2.0-flash",
        google_api_key=google_api_key,
    )


portia_config = create_portia_config()


pdf_reader = PDFReaderTool()

my_tool_registry = InMemoryToolRegistry(
    [
        pdf_reader,
    ]
)

complete_tool_registry = my_tool_registry + example_tool_registry
