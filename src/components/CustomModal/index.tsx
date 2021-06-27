import { ReactNode } from 'react'
import Modal from 'react-modal'
import './style.scss'

Modal.setAppElement('#root')

type ModalProps = {
  isOpen: string
  setIsOpen: (value: string) => void
  contentLabel: string
  children: ReactNode
}

export function CustomModal({
  isOpen,
  setIsOpen,
  contentLabel,
  children
}: ModalProps) {

  return (
    <Modal
      isOpen={isOpen ? true : false}
      onRequestClose={() => setIsOpen('')}
      contentLabel={contentLabel}
      closeTimeoutMS={200}
    >
      {children}
    </Modal>
  )
}