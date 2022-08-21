
export interface VideoItem {
  checked?: string | number | symbol | undefined
  id?: string
  coverUrl?: string
  desc?: string
}

export interface DownloadItem {
  name: string
  progress: number
}

export interface DownloadedItem {
  name: string
  datetime: string
}