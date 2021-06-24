import toast, { Toaster } from 'react-hot-toast'
import copyImg from '../../assets/images/copy.svg'
import './style.scss'

type RoomCodeProps = {
    code: string
}

export function RoomCode({ code }: RoomCodeProps) {
    function CopyRoomCode() {
        navigator.clipboard.writeText(code)
        toast.success('Código copiado com sucesso :)', {
            position: 'bottom-center',
            style: {
                marginBottom: '48px'
            }
        })
    }

    return (
        <>
        <button className="room-code" onClick={CopyRoomCode}>
            <div>
                <img src={copyImg} alt="Copiar código" />
            </div>

            <span>Código: {code}</span>

        </button>
        <Toaster />
        </>
    )
}