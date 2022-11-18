import { Table } from "antd";
import React from "react";
import { DivProps } from "./Components/Interface";
import "antd/dist/antd.min.css";

interface TableResProps extends DivProps {
  columns: [];
  data: [];
  onChange: () => void;
}

export const TableRes: React.FC<TableResProps> = (props: TableResProps) => {
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
};
