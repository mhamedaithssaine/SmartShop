import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderApi } from '../../api/orderApi.js';
import { customerApi } from '../../api/customerApi.js';
import { useAuth } from '../../state/AuthContext.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card, CardHeader, CardBody } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { formatAmount, formatDate } from '../../utils/format.js';
import { COMMANDE_STATUT_OPTIONS } from '../../constants/backend.js';

const PAGE_SIZE = 10;

export function OrderList() {
  const { user, isAdmin } = useAuth();
  const isClient = !isAdmin && user?.customerId != null;
  const fixedCustomerId = isClient ? user.customerId : null;

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterClientId, setFilterClientId] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    async function loadCustomers() {
      try {
        const data = await customerApi.getAll();
        if (!cancelled) setCustomers(Array.isArray(data) ? data : []);
      } catch (_) {}
    }
    loadCustomers();
    return () => { cancelled = true; };
  }, [isAdmin]);

  const effectiveClientId = fixedCustomerId ?? (filterClientId || undefined);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (filterStatut) params.statut = filterStatut;
        if (effectiveClientId) params.customerId = effectiveClientId;
        const data = await orderApi.getAll(params);
        if (!cancelled) setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Erreur chargement commandes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [filterStatut, effectiveClientId]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return orders.slice(start, start + PAGE_SIZE);
  }, [orders, page]);

  const totalPages = Math.ceil(orders.length / PAGE_SIZE) || 1;

  const columns = [
    { key: 'id', label: 'N°' },
    { key: 'customerNom', label: 'Client' },
    { key: 'createdAt', label: 'Date', render: (v) => formatDate(v) },
    { key: 'totalTTC', label: 'Total TTC', render: (v) => formatAmount(v) },
    { key: 'statut', label: 'Statut', render: (v) => (v ? <Badge value={v} /> : '–') },
    { key: 'montantRestant', label: 'Restant dû', render: (v) => formatAmount(v) },
    {
      key: 'id',
      label: '',
      render: (oid) => (
        <Link to={`/orders/${oid}`}>
          <Button variant="ghost" size="sm">Voir</Button>
        </Link>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <CardHeader
          title={isClient ? 'Mes commandes' : 'Commandes'}
          action={
            isAdmin && (
              <Link to="/orders/new">
                <Button>Nouvelle commande</Button>
              </Link>
            )
          }
        />
        <CardBody>
          <div className="mb-4 flex flex-wrap gap-4">
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="input-field max-w-[180px]"
            >
              {COMMANDE_STATUT_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {isAdmin && (
              <select
                value={filterClientId}
                onChange={(e) => setFilterClientId(e.target.value)}
                className="input-field max-w-[220px]"
              >
                <option value="">Tous les clients</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            )}
          </div>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
            </div>
          ) : (
            <>
              <Table columns={columns} data={paginated} emptyMessage="Aucune commande" />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={orders.length}
                pageSize={PAGE_SIZE}
              />
            </>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
