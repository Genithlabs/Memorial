export interface VisitorMessage {
	id: number
	user_id: number
	user_name: string
	memorial_id: number
	message: string
	is_visible: number
	created_at: string
	updated_at: string
}

export interface Memory {
	id: number
	user_id: number
	user_name: string|null
	memorial_id: number
	title: string
	message: string
	attachment_id: number
	is_visible: number
	created_at: string
	updated_at: string
}

export interface AttachmentProfileImage {
	id: number
	file_path: string
	file_name: string
	is_delete: number
	deleted_at: string | null
	created_at: string
	updated_at: string
}

export interface AttachmentBgm {
	id: number
	file_path: string
	file_name: string
	is_delete: number
	deleted_at: string | null
	created_at: string
	updated_at: string
}


export interface Detail {
	id: number
	birth_start: string
	birth_end: string
	career_contents: string
	is_open: number
	profile_attachment_id: number
	bgm_attachment_id: number
	created_at: string
	updated_at: string
	attachment_profile_image: AttachmentProfileImage
	attachment_bgm: AttachmentBgm
}

export interface ALLProps {
	visitorMessages: VisitorMessage[]
	memories: Memory[]
	detail: Detail
	memorialId: number
}

export interface LifeProps {
	visitorMessages: VisitorMessage[]
	detail: Detail
	memorialId: number
}

export interface MemoryProps {
	memories: Memory[]
	memorialId: number
}