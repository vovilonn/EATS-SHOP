import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { TypeDispatch } from '@/shared/store';

import { fetchAllClients } from '@/shared/store/admin/requests';

import IAccountInfo from '@/shared/interfaces/accountInfo.interface';

import * as XLSX from 'xlsx';

import { Button, Table, TableProps } from 'antd';

const ClientsPageContent: React.FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { clients } = useTypedSelector((state) => state.adminPanel);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<IAccountInfo[]>([]);

  useEffect(() => {
    dispatch(fetchAllClients());
  }, [dispatch]);

  const columns: TableProps<IAccountInfo>['columns'] = [
    {
      title: "Ім'я",
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || 'Невідомо',
    },
    {
      title: 'Пошта',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || 'Невідомо',
    },
    { title: 'Номер телефону', dataIndex: 'number', key: 'number' },
    {
      title: 'Місто',
      dataIndex: 'model_city',
      key: 'model_city',
      render: (model_city) => model_city?.name || 'Невідомо',
    },
    {
      title: 'Дата народження',
      dataIndex: 'date_birthday',
      key: 'date_birthday',
      render: (date_birthday) => date_birthday || 'Невідомо',
    },
  ];

  const rowSelection: TableProps<IAccountInfo>['rowSelection'] = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selectedRows) => {
      setSelectedRowKeys(newSelectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };

  const exportToExcel = () => {
    const dataToExport = selectedRows.map((row) => ({
      "Ім'я": row.name || 'Невідомо',
      Пошта: row.email || 'Невідомо',
      'Номер телефону': row.number || 'Невідомо',
      Місто: row.model_city?.name || 'Невідомо',
      'Дата народження': row.date_birthday || 'Невідомо',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Клієнти');
    XLSX.writeFile(workbook, 'clients_data.xlsx');
  };

  return (
    <>
      <Button
        type="primary"
        onClick={exportToExcel}
        style={{ marginBottom: '20px' }}
        disabled={selectedRowKeys.length === 0}
      >
        Імпортувати
      </Button>
      <Table<IAccountInfo>
        columns={columns}
        dataSource={clients}
        pagination={false}
        rowSelection={{ type: 'checkbox', ...rowSelection }}
        rowKey="id"
      />
    </>
  );
};

export default ClientsPageContent;
