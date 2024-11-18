import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { TypeDispatch } from '@/shared/store';

import { fetchAllClients } from '@/shared/store/admin/requests';
import IAccountInfo from '@/shared/interfaces/accountInfo.interface';

import { Button, Table, TableProps } from 'antd';
import * as XLSX from 'xlsx';

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
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || 'Неизвестно',
    },
    {
      title: 'Почта',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || 'Неизвестно',
    },
    { title: 'Номер телефона', dataIndex: 'number', key: 'number' },
    {
      title: 'Город',
      dataIndex: 'model_city',
      key: 'model_city',
      render: (model_city) => model_city?.name || 'Неизвестно',
    },
    {
      title: 'Дата рождения',
      dataIndex: 'date_birthday',
      key: 'date_birthday',
      render: (date_birthday) => date_birthday || 'Неизвестно',
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
      Имя: row.name || 'Неизвестно',
      Почта: row.email || 'Неизвестно',
      'Номер телефона': row.number || 'Неизвестно',
      Город: row.model_city?.name || 'Неизвестно',
      'Дата рождения': row.date_birthday || 'Неизвестно',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Клиенты');
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
        Импортировать
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
