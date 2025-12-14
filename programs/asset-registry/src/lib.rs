use anchor_lang::prelude::*;

pub mod error;
pub mod instructions;
pub mod state;

pub use instructions::*;
pub use state::*;

declare_id!("AssetReg111111111111111111111111111111111");

#[program]
pub mod asset_registry {
    use super::*;

    /// 注册新资产（演员/场景/道具）
    pub fn register_asset(
        ctx: Context<RegisterAsset>,
        name: String,
        metadata_uri: String,
        asset_type: AssetType,
    ) -> Result<()> {
        instructions::register_asset::handler(ctx, name, metadata_uri, asset_type)
    }

    /// 记录资产使用（在某个故事节点中被使用）
    pub fn record_usage(ctx: Context<RecordUsage>) -> Result<()> {
        instructions::record_usage::handler(ctx)
    }
}
