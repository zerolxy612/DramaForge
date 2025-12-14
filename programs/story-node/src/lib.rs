use anchor_lang::prelude::*;

pub mod error;
pub mod instructions;
pub mod state;

pub use instructions::*;
pub use state::*;

declare_id!("StoryNode11111111111111111111111111111111");

#[program]
pub mod story_node {
    use super::*;

    /// 确认故事节点（用户选择分支后上链）
    pub fn confirm_node(
        ctx: Context<ConfirmNode>,
        frame_uri: String,
        duration: u16,
    ) -> Result<()> {
        instructions::confirm_node::handler(ctx, frame_uri, duration)
    }

    /// 记录节点访问
    pub fn record_visit(ctx: Context<RecordVisit>) -> Result<()> {
        instructions::record_visit::handler(ctx)
    }
}
