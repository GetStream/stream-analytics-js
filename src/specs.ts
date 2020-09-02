export type Feature = {
    group: string;
    value: string;
};

export type Engagement = {
    content: string | Record<string, unknown>;
    label: string;
    boost?: number;
    features?: Feature[];
    feed_id?: string;
    location?: string;
    position?: number;
    score?: number;
};

export type Impression = {
    content_list: Array<string | Record<string, unknown>>;
    features?: Feature[];
    feed_id?: string;
    location?: string;
    position?: number;
    tracked_at?: string;
};

const validateFeatures = (features?: Feature[]) => {
    if (!features) return '';
    if (!Array.isArray(features)) return 'features should be array';

    for (let i = 0; i < features.length; i += 1) {
        if (!features[i].group || typeof features[i].group !== 'string') return 'feature.group should be string';
        if (!features[i].value || typeof features[i].value !== 'string') return 'feature.value should be string';
    }
    return '';
};

export const validateEngagement = (engagement: Engagement) => {
    if (!engagement) return ['engagement should be an object'];

    const errors: string[] = [];

    if (!engagement.label && typeof engagement.label !== 'string') errors.push('label should be string');
    if (!engagement.content || (typeof engagement.content !== 'string' && typeof engagement.content !== 'object'))
        errors.push('content should be string or object');

    if (engagement.position !== undefined && typeof engagement.position !== 'number')
        errors.push('position should be number');
    if (engagement.score !== undefined && typeof engagement.score !== 'number') errors.push('score should be number');
    if (engagement.boost !== undefined && typeof engagement.boost !== 'number') errors.push('boost should be number');
    if (engagement.feed_id !== undefined && typeof engagement.feed_id !== 'string')
        errors.push('feed_id should be string)');
    if (engagement.location !== undefined && typeof engagement.location !== 'string')
        errors.push('location should be string');

    const featureErr = validateFeatures(engagement.features);
    if (featureErr) errors.push(featureErr);

    return errors.length ? errors : false;
};

export const validateImpression = (impression: Impression) => {
    if (!impression) return ['impression should be an object'];

    const errors: string[] = [];

    if (!Array.isArray(impression.content_list) || !impression.content_list.length)
        errors.push('content should be array of strings or objects');

    if (impression.feed_id !== undefined && typeof impression.feed_id !== 'string')
        errors.push('feed_id should be string');
    if (impression.location !== undefined && typeof impression.location !== 'string')
        errors.push('location should be string');

    const featureErr = validateFeatures(impression.features);
    if (featureErr) errors.push(featureErr);

    return errors.length ? errors : false;
};
