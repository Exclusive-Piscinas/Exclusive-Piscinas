import { Product } from '@/hooks/useProducts';
import { Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
}

export const createProductColumns = (categories: Category[]): Column<Product>[] => [
  {
    key: 'main_image',
    label: 'Imagem',
    render: (value) => value ? (
      <img src={value} alt="Produto" className="w-12 h-12 rounded object-cover" />
    ) : '-',
  },
  {
    key: 'name',
    label: 'Nome',
    sortable: true,
  },
  {
    key: 'category_id',
    label: 'Categoria',
    render: (value) => {
      const category = categories.find(c => c.id === value);
      return category ? category.name : 'Sem categoria';
    },
  },
  {
    key: 'price',
    label: 'Preço',
    render: (value) => value ? `R$ ${value.toLocaleString('pt-BR')}` : '-',
    sortable: true,
  },
  {
    key: 'active',
    label: 'Status',
    render: (value) => (
      <Badge variant={value ? 'default' : 'secondary'}>
        {value ? 'Ativo' : 'Inativo'}
      </Badge>
    ),
  },
  {
    key: 'featured',
    label: 'Destaque',
    render: (value) => (
      <Badge variant={value ? 'default' : 'outline'}>
        {value ? 'Sim' : 'Não'}
      </Badge>
    ),
  },
];