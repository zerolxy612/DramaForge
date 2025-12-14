use anchor_lang::prelude::*;

#[error_code]
pub enum AssetError {
    #[msg("Asset name cannot be empty")]
    NameEmpty,

    #[msg("Asset name exceeds maximum length of 64 characters")]
    NameTooLong,

    #[msg("Metadata URI cannot be empty")]
    MetadataUriEmpty,

    #[msg("Metadata URI exceeds maximum length of 200 characters")]
    MetadataUriTooLong,

    #[msg("Asset already registered")]
    AssetAlreadyRegistered,

    #[msg("Invalid asset type")]
    InvalidAssetType,
}
