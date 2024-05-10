export type MemorialCard = {
    id: number;
    attachment_profile_image: {
        file_path: string
        file_name: string
    }
};

export interface MainProps {
    memorialCards: MemorialCard[];
}