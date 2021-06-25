import { Link } from "react-router-dom"
import logoImg from '../../assets/images/logo.svg'
import "./style.scss"

export function Header() {
  return (
    <header className="empty-header">
      <Link to="/">
        <img src={logoImg} alt="LetMeAsk" />
      </Link>
    </header>
  );
}
