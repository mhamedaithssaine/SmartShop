import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productApi } from '../../api/productApi.js';
import { useAuth } from '../../state/AuthContext.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card, CardHeader, CardBody } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { formatAmount } from '../../utils/format.js';
import { confirmDialog } from '../../utils/confirm.js';

const PAGE_SIZE = 10;

export function ProductList() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = search.trim()
          ? await productApi.search(search.trim())
          : await productApi.getAll();
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Erreur chargement produits');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return products.slice(start, start + PAGE_SIZE);
  }, [products, page]);

  const totalPages = Math.ceil(products.length / PAGE_SIZE) || 1;

  const handleDelete = async (id) => {
    const ok = await confirmDialog('Supprimer ce produit ?', 'Cette action effectue un soft delete.', 'Supprimer', 'Annuler');
    if (!ok) return;
    setError('');
    try {
      await productApi.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError(e.message || 'Erreur lors de la suppression');
    }
  };

  const columns = [
    { key: 'nom', label: 'Nom' },
    { key: 'prixUnitaire', label: 'Prix HT', render: (v) => formatAmount(v) },
    { key: 'stockDisponible', label: 'Stock' },
    { key: 'categorie', label: 'Catégorie' },
    ...(isAdmin
      ? [{
          key: 'id',
          label: 'Actions',
          render: (id) => (
            <div className="flex flex-wrap gap-2">
              <Link to={`/products/${id}/edit`}>
                <Button variant="secondary" size="sm"><Pencil className="h-4 w-4 shrink-0" /> Modifier</Button>
              </Link>
              <Button variant="danger" size="sm" onClick={() => handleDelete(id)}>
                <Trash2 className="h-4 w-4 shrink-0" /> Supprimer
              </Button>
            </div>
          ),
        }]
      : []),
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <CardHeader
          title="Produits"
          action={
            isAdmin && (
              <Link to="/products/new">
                <Button><Plus className="h-4 w-4 shrink-0" /> Nouveau produit</Button>
              </Link>
            )
          }
        />
        <CardBody>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Input
              placeholder="Rechercher par nom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
            </div>
          ) : (
            <>
              <Table columns={columns} data={paginated} emptyMessage="Aucun produit" />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={products.length}
                pageSize={PAGE_SIZE}
              />
            </>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
