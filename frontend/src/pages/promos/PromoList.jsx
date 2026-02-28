import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { promoApi } from '../../api/promoApi.js';
import { Table } from '../../components/ui/Table.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card, CardHeader, CardBody } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { formatDate } from '../../utils/format.js';
import { Pencil, Power, PowerOff, Trash2, Plus } from 'lucide-react';
import { confirmDialog } from '../../utils/confirm.js';

const PAGE_SIZE = 10;

const FILTER_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'actifs', label: 'Actifs' },
  { value: 'inactifs', label: 'Inactifs' },
  { value: 'valides', label: 'Valides (actifs + dans les dates + non épuisés)' },
];

export function PromoList() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        let data;
        if (filter === 'actifs') {
          data = await promoApi.getActive();
        } else if (filter === 'valides') {
          data = await promoApi.getValid();
        } else if (filter === 'inactifs') {
          const all = await promoApi.getAll();
          data = Array.isArray(all) ? all.filter((p) => p.actif === false) : [];
        } else {
          data = await promoApi.getAll();
        }
        if (!cancelled) setPromos(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Erreur chargement codes promo');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [filter]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return promos.slice(start, start + PAGE_SIZE);
  }, [promos, page]);

  const totalPages = Math.ceil(promos.length / PAGE_SIZE) || 1;

  const handleToggle = async (id) => {
    setError('');
    try {
      const updated = await promoApi.toggle(id);
      setPromos((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (e) {
      setError(e.message || 'Erreur lors du changement de statut');
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirmDialog('Supprimer ce code promo ?', '', 'Supprimer', 'Annuler');
    if (!ok) return;
    setError('');
    try {
      await promoApi.delete(id);
      setPromos((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError(e.message || 'Erreur lors de la suppression');
    }
  };

  const columns = [
    { key: 'code', label: 'Code' },
    {
      key: 'pourcentageRemise',
      label: 'Remise %',
      render: (v) => (v != null ? `${Number(v)} %` : '–'),
    },
    { key: 'dateDebut', label: 'Début', render: (v) => formatDate(v) },
    { key: 'dateExpiration', label: 'Expiration', render: (v) => formatDate(v) },
    {
      key: 'nombreUtilisations',
      label: 'Utilisations',
      render: (v, row) =>
        row.nombreUtilisationsMax != null
          ? `${v ?? 0} / ${row.nombreUtilisationsMax}`
          : String(v ?? 0),
    },
    {
      key: 'actif',
      label: 'Actif',
      render: (actif) => (actif ? <Badge value="Oui" variant="bg-emerald-500/20 text-emerald-300" /> : <Badge value="Non" variant="bg-slate-500/20 text-slate-400" />),
    },
    {
      key: 'utilisable',
      label: 'Utilisable',
      render: (utilisable) =>
        utilisable != null
          ? (utilisable ? <Badge value="Oui" variant="bg-emerald-500/20 text-emerald-300" /> : <Badge value="Non" variant="bg-slate-500/20 text-slate-400" />)
          : '–',
    },
    {
      key: 'id',
      label: 'Actions',
      render: (id, row) => (
        <div className="flex flex-wrap gap-2">
          <Link to={`/promo-codes/${id}/edit`}>
            <Button variant="secondary" size="sm"><Pencil className="h-4 w-4 shrink-0" /> Modifier</Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => handleToggle(id)}>
            {row.actif ? <><PowerOff className="h-4 w-4 shrink-0" /> Désactiver</> : <><Power className="h-4 w-4 shrink-0" /> Activer</>}
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(id)}>
            <Trash2 className="h-4 w-4 shrink-0" /> Supprimer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <CardHeader
          title="Codes promo"
          action={
            <Link to="/promo-codes/new">
              <Button><Plus className="h-4 w-4 shrink-0" /> Nouveau code promo</Button>
            </Link>
          }
        />
        <CardBody>
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <label htmlFor="promo-filter" className="text-sm font-medium text-slate-300">
              Filtre :
            </label>
            <select
              id="promo-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field max-w-xs"
            >
              {FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
            </div>
          ) : (
            <>
              <Table columns={columns} data={paginated} emptyMessage="Aucun code promo" />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={promos.length}
                pageSize={PAGE_SIZE}
              />
            </>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
