import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react'
import { useAppConfig } from '@renderer/hooks/use-app-config'

interface Props {
  onChange: (open: boolean) => void
  title?: string
  description?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
}

const ConfirmModal: React.FC<Props> = (props) => {
  const {
    onChange,
    title = '请确认',
    description,
    confirmText = '确认',
    cancelText = '取消',
    onConfirm
  } = props
  const { appConfig: { disableAnimation = false } = {} } = useAppConfig()

  return (
    <Modal
      backdrop={disableAnimation ? 'transparent' : 'blur'}
      disableAnimation={disableAnimation}
      hideCloseButton
      isOpen={true}
      size="5xl"
      onOpenChange={onChange}
      scrollBehavior="inside"
      classNames={{
        base: 'max-w-none w-full',
        backdrop: 'top-[48px]'
      }}
    >
      <ModalContent className="w-[400px]">
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <div className="leading-relaxed">{description}</div>
        </ModalBody>
        <ModalFooter className="space-x-2">
          <Button size="sm" variant="light" onPress={() => onChange(false)}>
            {cancelText}
          </Button>
          <Button
            size="sm"
            color="danger"
            onPress={async () => {
              await onConfirm()
              onChange(false)
            }}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default ConfirmModal
