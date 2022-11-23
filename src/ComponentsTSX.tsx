import { Modal, Table } from "antd";
import { DivProps } from "./Components/Interface";
import "antd/dist/antd.min.css";

interface TableResProps extends DivProps {
  columns: [];
  data: [];
  onChange: () => void;
}

export function TableRes(props: TableResProps) {
  const { columns, data } = props;

  return (
    <Table
      onChange={props.onChange}
      style={props.style}
      columns={columns}
      dataSource={data}
      pagination={{
        defaultPageSize: 5,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20", "30"],
      }}
    />
  );
}

interface PopupDialogProps extends DivProps {
  width?: number;
  centered?: boolean;
  callback: () => void;
}

export function PopupDialog(props: PopupDialogProps) {
  const handleOk = () => {
    props.callback();
  };

  const handleCancel = () => {
    props.callback();
  };

  return (
    <Modal
      width={props.width}
      centered={props.centered}
      open={true}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      {props.children}
    </Modal>
  );
}
