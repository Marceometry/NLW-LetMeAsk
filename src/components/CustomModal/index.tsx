import { ReactNode } from 'react'
import Modal from 'react-modal'
import './style.scss'

Modal.setAppElement('#root')

type ModalProps = {
  id: string
  isOpen: string
  setIsOpen: (value: string) => void
  contentLabel: string
  imgSrc: string
  title: string
  description: string
  children: ReactNode
}

export function CustomModal({
  id,
  isOpen,
  setIsOpen,
  contentLabel,
  imgSrc,
  title,
  description,
  children
}: ModalProps) {

  return (
    <Modal
      isOpen={id === isOpen}
      // onAfterOpen={afterOpenModal}
      onRequestClose={() => setIsOpen('')}
      contentLabel={contentLabel}
    >
      <img src={imgSrc} alt="Ícone de exclusão" />

      <h2>{title}</h2>
      <p>{description}</p>

      <div className="buttons">
        {children}
      </div>
    </Modal>
  )
}