import { Link } from "react-router-dom"
import logoImg from '../../assets/images/logo.svg'
import "./style.scss"

export function Header() {
  return (
    <header className="empty-header">
      <div className="content">
        <Link to="/">
          <img src={logoImg} alt="LetMeAsk" />
        </Link>
      </div>
    </header>
  );
}
