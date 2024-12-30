import {FC, useState} from "react";
import S from './style.module.scss';
import {Modal} from "antd";
import Button from "@/shared/components/ui/button";

export const ScheduleLine: FC = () => {
  const [isModal, setIsModal] = useState(false);

  return (
    <div className={S.container}>
      <Button onClick={() => setIsModal(true)}>Просмотреть время работы</Button>
      <Modal open={isModal} onCancel={() => setIsModal(false)} footer={null}>
        <h2>Графік роботи</h2>
        <p>
          30.12.2024 до 18:00
        </p>
        <p>
          31.12.2024 до 18:30
        </p>
        <p>
          1.1.2025 з 13:00 до 21:50
        </p>
        <p>
          6.1.2025 до 18:30
        </p>
        <p>
          7.1.2025 вихідний
        </p>
      </Modal>
    </div>
  );
};
