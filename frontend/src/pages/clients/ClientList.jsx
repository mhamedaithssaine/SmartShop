import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { customerApi } from '../../api/customerApi.js';
import { Table } from '../../components/ui/Table.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card, CardHeader, CardBody } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { formatAmount } from '../../utils/format.js';

const PAGE_SIZE = 10;

export function ClientList() {
  const [clients, setClients] = useState([]);
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
        const data = await customerApi.getAll();
        if (!cancelled) setClients(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Erreur chargement clients');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return clients;
    const q = search.trim().toLowerCase();
    return clients.filter(
      (c) =>
        (c.nom && c.nom.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [clients, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;

  const columns = [
    { key: 'nom', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'tier', label: 'Niveau fidélité', render: (v) => (v ? <Badge value={v} /> : '–') },
    { key: 'totalOrders', label: 'Commandes' },
    { key: 'totalSpent', label: 'Total dépensé', render: (v) => formatAmount(v) },
    {
      key: 'id',
      label: 'Actions',
      render: (id) => (
        <div className="flex gap-2">
          <Link to={`/clients/${id}`}>
            <Button variant="ghost" size="sm">Détails</Button>
          </Link>
          <Link to={`/clients/${id}/edit`}>
            <Button variant="secondary" size="sm">Modifier</Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <CardHeader
          title="Clients"
          action={
            <Link to="/clients/new">
              <Button>Nouveau client</Button>
            </Link>
          }
        />
        <CardBody>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Input
              placeholder="Rechercher par nom ou email..."
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
              <Table columns={columns} data={paginated} emptyMessage="Aucun client" />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
              />
            </>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
