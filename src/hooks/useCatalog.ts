'use client';

import { useEffect, useMemo, useState } from 'react';

import type { CatalogBrand, CatalogResponse, CatalogVehicle } from '@/lib/data/catalog';

type UseCatalogOptions = {
  brand?: string;
  model?: string;
  year?: number;
  q?: string;
  limit?: number;
  id?: string;
};

function buildQuery(options: UseCatalogOptions) {
  const params = new URLSearchParams();

  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

export function useCatalog(options: UseCatalogOptions = {}) {
  const { brand, id, limit, model, q, year } = options;
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [vehicles, setVehicles] = useState<CatalogVehicle[]>([]);
  const [featuredVehicles, setFeaturedVehicles] = useState<CatalogVehicle[]>([]);
  const [stats, setStats] = useState<CatalogResponse['stats'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(
    () => buildQuery({ brand, id, limit, model, q, year }),
    [brand, id, limit, model, q, year],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/vehicles${queryString ? `?${queryString}` : ''}`, {
          signal: controller.signal,
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Araç verisi alınamadı');
        }

        const data = await response.json();
        setBrands(data.brands ?? []);
        setVehicles(data.vehicles ?? []);
        setFeaturedVehicles(data.featuredVehicles ?? []);
        setStats(data.stats ?? null);
      } catch (fetchError) {
        if (!(fetchError instanceof DOMException && fetchError.name === 'AbortError')) {
          setError(fetchError instanceof Error ? fetchError.message : 'Araç verisi alınamadı');
        }
      } finally {
        setIsLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [queryString]);

  return {
    brands,
    vehicles,
    featuredVehicles,
    stats,
    isLoading,
    error,
  };
}

export function useVehicle(id?: string) {
  const [vehicle, setVehicle] = useState<CatalogVehicle | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const vehicleId = id ?? '';
    if (!vehicleId) {
      setVehicle(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/vehicles?id=${encodeURIComponent(vehicleId)}`, {
          signal: controller.signal,
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Araç detayı alınamadı');
        }

        const data = await response.json();
        setVehicle(data.vehicle ?? null);
      } catch (fetchError) {
        if (!(fetchError instanceof DOMException && fetchError.name === 'AbortError')) {
          setError(fetchError instanceof Error ? fetchError.message : 'Araç detayı alınamadı');
        }
      } finally {
        setIsLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

  return {
    vehicle,
    isLoading,
    error,
  };
}
