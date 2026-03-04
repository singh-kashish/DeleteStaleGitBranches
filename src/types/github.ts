export type Repo = {
  id: number
  name: string
  owner: { login: string }
  default_branch: string
  pushed_at: string
}
