from app.agents.models.agent import Agent, AgentTool
from app.agents.models.connection import LlmConnection
from app.agents.models.conversation import Conversation, Message
from app.agents.models.knowledge import KnowledgeDoc, KnowledgeChunk
from app.agents.models.usage import LlmUsage

# Re-run the autostamp installer now that Agent + Conversation are loaded so
# their inserts inherit workspace_id like the core financial models. Safe to
# call multiple times — the listener registration is idempotent.
from app.core.workspace_autostamp import install_workspace_autostamp  # noqa: E402

install_workspace_autostamp()

__all__ = [
    "Agent",
    "AgentTool",
    "LlmConnection",
    "Conversation",
    "Message",
    "KnowledgeDoc",
    "KnowledgeChunk",
    "LlmUsage",
]
