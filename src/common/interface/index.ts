
export interface VideoItem {
  checked?: string | number | symbol | undefined
  id?: string
  coverUrl?: string
  desc?: string
}

export interface DownloadItem {
  id: string
  name: string
  progress: number
  status: string
}

export interface DownloadedItem {
  id: string
  name: string
  path: string
  datetime: string
}