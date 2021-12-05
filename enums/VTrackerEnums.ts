enum thumbnailResolution {
    default     = 'default',
    medium      = 'medium',
    high        = 'high',
    standard    = 'standard',
    max         = 'max'
}

enum playability {
    playable                = 'playable',
    loginRequired           = 'loginRequired', 
    removed                 = 'removed',
    unavailable             = 'unavailable',
    memberOnly              = 'memberOnly',
    ageRestricted           = 'ageRestricted',
    violating               = 'violating',
    copyrightStrike         = 'copyrightStrike',
    copyrightClaim          = 'copyrightClaim',
    recordingNotAvailable   = 'recordingNotAvailable', 
    channelTerminated       = 'channelTerminated',
    channelClosed           = 'channelClosed'
}

enum visibility {
    // Video
    public      = 'public',
    unlisted    = 'unlisted',
    private     = 'private',
    unavailable = 'unavailable',

    // Channel
    notExists       = 'notExists',
    terminated      = 'terminated',
    suspended       = 'suspended',
    notAvailable    = 'notAvailable',
    unknown         = 'unknown'
}

enum status {
    published   = 'published', 
    upcoming    = 'upcoming',
    ongoing     = 'ongoing',
}

enum type {
    upload      = 'upload', 
    live        = 'live',
    premiere    = 'premiere'
}

export {
    thumbnailResolution,
    playability,
    visibility,
    status,
    type
}