import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'leads.json');

export async function GET() {
  try {
    if (!fs.existsSync(filePath)) return NextResponse.json({});
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');

    // Gross contract totals handled on behalf of clients
    const grossPipeline = data.reduce((acc: number, item: any) => acc + item.dealValue, 0);
    const grossWon = data.filter((i: any) => i.outcome === 'Won').reduce((acc: number, item: any) => acc + item.dealValue, 0);

    // Agency-specific revenue tracking (Your business cuts)
    const totalAgencyEarned = data
      .filter((i: any) => i.outcome === 'Won')
      .reduce((acc: number, item: any) => acc + (item.dealValue * (item.agencyCommissionPct / 100)), 0);

    // Projected commission forecasting model (Value * Confidence % * Commission %)
    const forecastedAgencyRevenue = data.reduce((acc: number, item: any) => {
      const confidenceWeight = (item.confidenceScore || 0) / 100;
      const commissionWeight = (item.agencyCommissionPct || 0) / 100;
      return acc + (item.dealValue * confidenceWeight * commissionWeight);
    }, 0);

    return NextResponse.json({
      metrics: {
        grossPipeline,
        clientRevenueSecured: grossWon,
        agencyCommissionsEarned: Math.round(totalAgencyEarned),
        agencyProjectedForecast: Math.round(forecastedAgencyRevenue)
      },
      counts: {
        totalOpportunities: data.length,
        activeClientsCount: new Set(data.map((item: any) => item.hiringClientId)).size
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed compiling agency metrics' }, { status: 500 });
  }
}
