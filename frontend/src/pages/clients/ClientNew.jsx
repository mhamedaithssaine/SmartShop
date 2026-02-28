import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { customerApi } from '../../api/customerApi.js';
import { Card, CardHeader, CardBody } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Plus, X } from 'lucide-react';
import { Input } from '../../components/ui/Input.jsx';

export function ClientNew() {
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await customerApi.create({ nom, email, telephone, password });
      navigate('/clients');
    } catch (err) {
      setError(err.errors ? Object.values(err.errors).join(', ') : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
      <div className="w-full max-w-2xl">
      <Card>
        <CardHeader title="Nouveau client" />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Téléphone (0XXXXXXXX ou +212...)"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
            />
            <Input
              label="Mot de passe (min. 6 caractères)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-3">
              <Button type="submit" loading={loading}><Plus className="h-4 w-4 shrink-0" /> Créer</Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/clients')}>
                <X className="h-4 w-4 shrink-0" /> Annuler
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
      </div>
    </motion.div>
  );
}
