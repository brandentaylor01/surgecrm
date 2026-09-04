"use client";

import React, { useState, useEffect } from 'react';

interface Opp {
  id: string;
  company: string;
  contact: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  clientKey: string;
  status: 'qualifying' | 'proposal' | 'secured' | 'lost';
  value: number;
  qty1: number;
  qty2: number;
}

interface Client {
  key: string;
  label: string;
  domain: string;
}

export default function RainmakerDashboard() {
  const [opps, setOpps] = useState<Opp[]>([]);
  const [sel, setSel] = useState<Opp | null>(null);
  const [activeClient, setActiveClient] = useState<string>('rainmaker');
  const [scanning, setScanning] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([
    { key: 'rainmaker', label: 'Rainmaker Sales LLC', domain: 'Internal' },
    { key: 'televoi', label: 'Televoi', domain: 'Charlie Myers' },
    { key: 'aim', label: 'Aim Restoration', domain: 'Kyle Ackerman' }
  ]);

  const [form, setForm] = useState({
    company: '',
    contact: '',
    city: '',
    address: '',
    email: '',
    phone: ''
  });

  const sync = async () => {
    const res = await fetch('/api/opportunities');
    if (res.ok) {
      const data = await res.json();
      const mapped = data.map((o: any) => ({
        id: o.id,
        company: o.company || 'Unnamed Company',
        status: o.status || 'qualifying',
        city: o.city || 'n/a',
        contact: o.contact || 'n/a',
        address: o.address || 'n/a',
        email: o.email || 'n/a',
        pho