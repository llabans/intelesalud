import {
  getProfessionalFilterOptions,
  listProfessionals,
  parseProfessionalFilters,
} from '@/lib/professionals/queries';
import { jsonNoStore } from '@/lib/security/http';

export async function GET(request) {
  try {
    const filters = parseProfessionalFilters(
      Object.fromEntries(request.nextUrl.searchParams.entries())
    );
    const [professionals, filterOptions] = await Promise.all([
      listProfessionals(filters),
      getProfessionalFilterOptions(),
    ]);

    return jsonNoStore({
      professionals,
      filterOptions,
    });
  } catch (error) {
    console.error('[Professionals] Failed to list professionals:', error);
    return jsonNoStore({ error: 'No se pudo cargar el directorio.' }, { status: 500 });
  }
}
