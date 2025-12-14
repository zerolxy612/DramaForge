use anchor_lang::prelude::*;

#[error_code]
pub enum StoryNodeError {
    #[msg("Frame URI cannot be empty")]
    FrameUriEmpty,

    #[msg("Frame URI exceeds maximum length of 200 characters")]
    FrameUriTooLong,

    #[msg("Duration must be greater than 0")]
    InvalidDuration,

    #[msg("Too many parent nodes (max 3)")]
    TooManyParents,

    #[msg("Too many assets (max 10)")]
    TooManyAssets,

    #[msg("Drama is already completed")]
    DramaCompleted,

    #[msg("Invalid parent node")]
    InvalidParentNode,
}
