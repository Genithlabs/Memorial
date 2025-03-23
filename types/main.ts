export type MemorialCard = {
    id: number;
    user_name: string;
    writer_name: string;
    attachment_profile_image: {
        file_path: string
        file_name: string
    }
};

export interface MainProps {
    memorialCards: MemorialCard[];
}