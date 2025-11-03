'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pencil, PlusCircle, Search, SlidersHorizontal, X, Calendar, ClipboardList, AlertTriangle } from 'lucide-react';
import Loader from '@/components/ui/Loader';
import { useAuth } from '@/context/AuthContext';
import InventoryForm, { InventoryFormData } from './InventoryForm';
import { InventoryItemUI, InventorySummary, InventoryWithBooking } from '@/types/inventory';
import InventoryFormModal from './InventoryForm';

type ApiInventoryItem = {
    inventoryItemId: string;
    name: string;
    quantity: number;
    condition?: string | null; // ex: "bon", "mauvais", "cassé", "manquant"...
};


// const statusColors: Record<InventoryUI['status'], string> = {
//   'OK': 'bg-green-100 text-green-800',
//   'Problème': 'bg-red-100 text-red-800',
// };

// const typeLabel = (t: number): InventoryUI['typeLabel'] =>
//   t === 0 ? 'Entrée' : t === 1 ? 'Sortie' : 'Autre';

// ce regex détecte des conditions “pas OK”
const PROBLEM_RE = /(mauvai|cass|hs|manquant|perdu|endommag|ab[iî]m|sale)/i;

const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : undefined;


export default function InventoryList() {
    const { token } = useAuth();

    //   const [inventories, setInventories] = useState<InventoryUI[]>([]);
    const [invs, setInvs] = useState<InventoryWithBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [filtersOpen, setFiltersOpen] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState<InventoryFormData | null>(null);

    const fetchInventoryById = async (inventoryId: string) => {
        try {
            const res = await fetch(`/api/inventories/${inventoryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 404) {
                return null;
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const inv = await res.json();
            console.log("data", inv);

            const normType: 0 | 1 = inv.type === 'arrival' ? 0 : 1;
            const items: InventoryItemUI[] = Array.isArray(inv.inventory_items)
                ? inv.inventory_items.map((it: any) => ({
                    inventoryItemId: it.inventory_item_id,
                    name: it.name,
                    quantity: it.quantity,
                    condition: it.condition ?? null,
                }))
                : [];

            const summary: InventorySummary = {
                id: inv.inventory_id,
                type: normType,
                createdAt: inv.created_at,
                comment: inv.comment ?? null,
                items,
            };
            console.log("summary", inv.inventory_id, summary);
            return summary;
        } catch (e: any) {
            console.error(e);
            setError(e.message);
            return null;
        } finally {
            //
        }
    }

    useEffect(() => {
        const fetchInventories = async () => {
            try {
                if (!token) return;
                setLoading(true);

                const res = await fetch('/api/inventories', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message ?? 'Erreur lors du chargement');
                console.log("data Inv", data)

                const inventories: InventoryWithBooking[] = await Promise.all(data.map(async (it: any) => {
                    console.log("it", it);
                    const inv: InventorySummary | null = await fetchInventoryById(it.inventory_id);

                    const res_name = it.booking?.res_name ? it.booking.res_name : "";
                    return {
                        booking_id: it.booking_id,
                        booking_res_name: res_name,
                        campsite_id: it.campsite_id,
                        campsiteName: it.campsite.name,
                        id: it.inventory_id,
                        type: inv?.type,
                        createdAt: it.created_at,
                        comment: it.comment ?? null,
                        items: inv?.items,
                    }
                }));
                console.log("inventories", inventories);
                setInvs(inventories);

            } catch (e: any) {
                setError(e.message ?? 'Erreur inconnue');
            } finally {
                setLoading(false);
            }
        };

        fetchInventories();
    }, [token]);

    const filtered = useMemo(() => {
        const needle = search.trim().toLowerCase();
        if (!needle) return invs;
        return invs.filter((inv) => {
            return (
                // inv.inventory_id.toLowerCase().includes(needle) ||
                // inv.typeLabel.toLowerCase().includes(needle) ||
                (inv.comment ?? '').toLowerCase().includes(needle)
            );
        });
    }, [invs, search]);

    const handleAddClick = () => {
        setSelectedInventory(null);
        setModalOpen(true);
    };

    //   const handleEditClick = (inv: InventoryUI) => {
    //     // adapte selon la signature de ton InventoryFormData
    //     const formData: InventoryFormData = {
    //       id: inv.inventory_id,
    //       type: inv.type,
    //       comment: inv.comment ?? undefined,
    //       items: inv._raw.items,
    //     };
    //     setSelectedInventory(formData);
    //     setModalOpen(true);
    //   };

    //   const handleSubmit = async (payload: InventoryFormData) => {
    //     try {
    //       const res = await fetch('/api/inventories', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //           Authorization: `Bearer ${token}`,
    //         },
    //         body: JSON.stringify(payload),
    //       });
    //       const created: ApiInventory = await res.json();
    //       if (!res.ok) throw new Error((created as any)?.message ?? 'Erreur lors de la création');

    //     //   setInventories((prev) => [toUI(created), ...prev]);
    //       setModalOpen(false);
    //     } catch (e) {
    //       console.error(e);
    //     }
    //   };

    if (loading) return <Loader className="h-56" />;
    if (error) {
        return (
            <div className="text-center text-red-600 my-6">
                Impossible de charger les inventaires : {error}
            </div>
        );
    }
    // helpers de rendu (aucune mutation des données)
    const getTypeLabel = (t?: 0 | 1) => (t === 0 ? 'Entrée' : 'Sortie');
    const getItemsCount = (inv: InventoryWithBooking) => inv.items?.length ?? 0;
    const getProblemsCount = (inv: InventoryWithBooking) =>
        (inv.items ?? []).filter((it) => PROBLEM_RE.test(it.condition ?? '')).length;

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
                <h1 className="text-2xl font-bold text-gray-800">Inventaires</h1>

                <button
                    onClick={handleAddClick}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
                >
                    <PlusCircle className="w-5 h-5" />
                    Ajouter un inventaire
                </button>
            </div>

            {/* Filtres mobile */}
            <div className="sm:hidden mb-4">
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium shadow hover:bg-green-700 transition"
                    onClick={() => setFiltersOpen(true)}
                    aria-haspopup="dialog"
                    aria-expanded={filtersOpen}
                    aria-controls="filters-inv-modal"
                >
                    <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
                    Filtres
                </button>

                {filtersOpen && (
                    <div
                        id="filters-inv-modal"
                        className="fixed inset-0 z-40 flex justify-center items-end bg-black/40"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="filters-inv-title"
                    >
                        <div className="bg-white w-full rounded-t-2xl p-6 max-w-md shadow-lg animate-slideup">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-lg font-semibold" id="filters-inv-title">
                                    Filtres
                                </span>
                                <button
                                    className="text-gray-400 hover:text-gray-700"
                                    onClick={() => setFiltersOpen(false)}
                                    aria-label="Fermer les filtres"
                                >
                                    <X className="w-6 h-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Recherche</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="ID, commentaire, nom réservation, type…"
                                            className="pl-8 pr-3 py-2 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                        />
                                        <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            <button
                                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                                onClick={() => setFiltersOpen(false)}
                            >
                                Voir les résultats
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Filtres desktop */}
            <div className="hidden sm:flex flex-row gap-3 mb-4 items-end">
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Recherche</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="ID, commentaire, nom réservation, type…"
                            className="pl-8 pr-3 py-2 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        />
                        <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Tableau desktop */}
            <div className="hidden sm:block bg-white rounded-xl shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Inventaire</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Créé le</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Éléments</th>
                            {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Problèmes</th> */}
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Emplacement</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Réservation</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filtered.map((inv, idx) => {
                            const itemsCount = getItemsCount(inv);
                            const problemsCount = getProblemsCount(inv);
                            return (
                                <tr key={inv.id || `inv-${idx}`} className="hover:bg-green-50 transition">
                                    <td className="px-4 py-3 font-semibold text-gray-800 flex items-center gap-2">
                                        <ClipboardList className="w-4 h-4 text-green-700" />
                                        {inv.id}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{getTypeLabel(inv.type)}</td>
                                    <td className="px-4 py-3 text-gray-500">{formatDate(inv.createdAt)}</td>
                                    <td className="px-4 py-3 text-gray-600">{itemsCount}</td>
                                    {/* <td className="px-4 py-3 text-gray-600 flex items-center gap-1">
                                        {problemsCount}
                                        {problemsCount > 0 && <AlertTriangle className="w-4 h-4 text-red-600" aria-hidden="true" />}
                                    </td> */}
                                    <td className="px-4 py-3 text-gray-600">{inv.campsiteName ?? '—'}</td>
                                    <td className="px-4 py-3 text-gray-600">{inv.booking_res_name ?? '—'}</td>
                                    <td className="px-4 py-3 flex justify-center gap-2">
                                        <button className="p-2 rounded hover:bg-yellow-100">
                                            <Pencil className="w-5 h-5 text-yellow-500" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Cards mobile */}
            <div className="space-y-4 sm:hidden">
                {filtered.map((inv, idx) => {
                    const itemsCount = getItemsCount(inv);
                    const problemsCount = getProblemsCount(inv);
                    return (
                        <div key={inv.id || `inv-${idx}`} className="bg-white rounded-xl shadow p-4 space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <ClipboardList className="w-5 h-5 text-green-700" />
                                        {inv.id}
                                    </h3>
                                    <p className="text-sm text-gray-500">{getTypeLabel(inv.type)}</p>
                                </div>
                            </div>

                            <div className="flex items-center text-sm text-gray-500 gap-2">
                                <Calendar className="w-4 h-4" aria-hidden="true" />
                                {formatDate(inv.createdAt)}
                            </div>
                            <div className="text-sm text-gray-600">
                                Éléments : {itemsCount} • Problèmes : {problemsCount}
                                {problemsCount > 0 && <AlertTriangle className="inline-block w-4 h-4 ml-1 text-red-600" aria-hidden="true" />}
                            </div>
                            <div className="text-sm text-gray-600">Réservation : {inv.booking_res_name ?? '—'}</div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button className="p-2 rounded hover:bg-yellow-100">
                                    <Pencil className="w-5 h-5 text-yellow-500" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal Formulaire (à réactiver quand prêt) */}
                <InventoryFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={(data) => {
                    console.log(data);
                }}
                initialItems={undefined}
                type="arrivee"
                // initialData={selectedInventory || undefined}
                />
           
        </div>
    );
}
