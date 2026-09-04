"use client";
import React, { useState, useEffect } from "react";
import { Users, Layers, TrendingUp, Plus, RefreshCw, Briefcase, MapPin } from "lucide-react";
// 1. Import Opp type directly from your detail panel source to eliminate duplicates
import DetailPanel, { Opp } from "@/app/DetailPanel";

export default function SalesforceWorkspace() {
  const [opportunities, setOpportunities] = useState<Opp[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<Opp | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/opportunities');
      const data = await res.json();
      setOpportunities(data);
    } catch (err) {
      console.error("Failed fetching pipeline registry:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSetField = async (id: string, field: keyof Opp, value: any) => {
    const updatedOpps = opportunities.map(opp => 
      opp.id === id ? { ...opp, [field]: value } : opp
    );
    setOpportunities(updatedOpps);
    
    if (selectedOpp && selectedOpp.id === id) {
      setSelectedOpp({ ...selectedOpp, [field]: value });
    }

    try {
      await fetch('/api/opportunities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, field, value })
      });
    } catch (err) {
      console.error("Failed persisting updates:", err);
    }
  };

  const totalLeads = opportunities.length;
  const grossPipeline = opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);
  
  const securedPipeline = opportunities
    .filter(opp => opp.status === 'secured')
    .reduce((sum, opp) => sum + (opp.value || 0), 0);
  const winRate = grossPipeline > 0 ? ((securedPipeline / grossPipeline) * 100).toFixed(1) : "0.0";

  const stages = ['qualifying', 'proposal', 'secured', 'lost'];
