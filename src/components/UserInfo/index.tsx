import "./style.scss"

type UserInfoProps = {
  name: string
  avatar: string
}

export function UserInfo({ name, avatar }: UserInfoProps) {
  return (
    <div className="user-info">
      <img src={avatar} alt={name} />
      <span>{name}</span>
    </div>
  )
}
