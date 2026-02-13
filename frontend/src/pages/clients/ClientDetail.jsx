import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { customerApi } from '../../api/customerApi.js';
import { Card, CardHeader, CardBody } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { formatAmount, formatDateTime } from '../../utils/format.js';

export function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [clientData, ordersData] = await Promise.all([
          customerApi.getById(id),
          customerApi.getOrders(id),
        ]);
        if (!cancelled) {
          setClient(clientData);
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Client introuvable');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (id) load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error || 'Client introuvable'}
        <Link to="/clients" className="ml-4 text-primary-600 hover:underline">Retour</Link>
      </div>
    );
  }

  const orderColumns = [
    { key: 'id', label: 'N°' },
    { key: 'statut', label: 'Statut', render: (v) => (v ? <Badge value={v} /> : '–') },
    { key: 'totalTTC', label: 'Total TTC', render: (v) => formatAmount(v) },
    { key: 'montantRestant', label: 'Restant dû', render: (v) => formatAmount(v) },
    { key: 'createdAt', label: 'Date', render: (v) => formatDateTime(v) },
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
          title={client.nom}
          action={
            <Link to={`/clients/${id}/edit`}>
              <Button variant="secondary">Modifier</Button>
            </Link>
          }
        />
        <CardBody className="space-y-6">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-slate-500">Email</dt>
              <dd className="mt-1 text-slate-900">{client.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Téléphone</dt>
              <dd className="mt-1 text-slate-900">{client.telephone || '–'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Niveau fidélité</dt>
              <dd className="mt-1"><Badge value={client.tier} /></dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Nombre de commandes confirmées</dt>
              <dd className="mt-1 text-slate-900">{client.totalOrders ?? 0}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Montant total dépensé</dt>
              <dd className="mt-1 text-slate-900">{formatAmount(client.totalSpent)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Première commande</dt>
              <dd className="mt-1 text-slate-900">{formatDateTime(client.firstOrderDate)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Dernière commande</dt>
              <dd className="mt-1 text-slate-900">{formatDateTime(client.lastOrderDate)}</dd>
            </div>
          </dl>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Historique des commandes" />
        <CardBody>
          <Table columns={orderColumns} data={orders} emptyMessage="Aucune commande" />
        </CardBody>
      </Card>
    </motion.div>
  );
}
