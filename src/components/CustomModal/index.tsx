import { ReactNode } from 'react'
import Modal from 'react-modal'
import './style.scss'

Modal.setAppElement('#root')

type ModalProps = {
  isOpen: string
  setIsOpen: (value: string) => void
  contentLabel: string
  imgSrc: string
  imgSize?: string
  title: string
  description: string
  children: ReactNode
}

export function CustomModal({
  isOpen,
  setIsOpen,
  contentLabel,
  imgSrc,
  imgSize,
  title,
  description,
  children
}: ModalProps) {

  return (
    <Modal
      isOpen={isOpen ? true : false}
      // onAfterOpen={afterOpenModal}
      onRequestClose={() => setIsOpen('')}
      contentLabel={contentLabel}
    >
      <img src={imgSrc} alt="Ícone de exclusão" style={imgSize ? {width: imgSize, height: imgSize} : {}} />

      <h2>{title}</h2>
      <p>{description}</p>

      <div className="buttons">
        {children}
      </div>
    </Modal>
  )
}