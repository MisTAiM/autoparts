/**
 * MODULE: catalog.js
 * Handles parts search, filter, sort, and pagination.
 * Operates against CATALOG.parts (the data layer).
 * Swap CATALOG.loadParts() to call your real API endpoint.
 */

const Catalog = (() => {

  // ─── Config ─────────────────────────────────────────────
  const PER_PAGE = 24;
  let _allParts = [];
  let _filtered  = [];
  let _currentPage = 1;
  let _activeFilters = { categories: [], brands: [], conditions: [], priceMin: 0, priceMax: Infinity };
  let _sortBy = 'relevance';
  let _searchQuery = '';
  let _vehicleFilter = null;

  // ─── Load parts from data layer ─────────────────────────
  async function loadParts(vehicleState) {
    _vehicleFilter = vehicleState || null;
    // In production: replace with real API call
    // e.g. const res = await fetch(`/api/parts?year=${vehicleState?.year}&make=${vehicleState?.makeName}&model=${vehicleState?.modelName}`);
    _allParts = await window.PartsData.getAll();
    applyFilters();
  }

  /** Filter a single category */
  async function loadByCategory(categoryId, vehicleState) {
    _vehicleFilter = vehicleState || null;
    _allParts = await window.PartsData.getByCategory(categoryId);
    _activeFilters.categories = [categoryId];
    applyFilters();
  }

  /** Full-text search */
  async function search(query, vehicleState) {
    _searchQuery = query.trim().toLowerCase();
    _vehicleFilter = vehicleState || null;
    _allParts = await window.PartsData.search(_searchQuery);
    applyFilters();
  }

  // ─── Filter & Sort ──────────────────────────────────────
  function applyFilters() {
    let results = [..._allParts];

    // Vehicle fitment filter
    if (_vehicleFilter?.year) {
      results = results.filter(p => {
        if (!p.fitment || p.fitment.length === 0) return true; // universal
        return p.fitment.some(f =>
          (!f.year  || f.year  === _vehicleFilter.year)  &&
          (!f.makeId || f.makeId === _vehicleFilter.makeId) &&
          (!f.modelId || f.modelId === _vehicleFilter.modelId)
        );
      });
    }

    // Category filter
    if (_activeFilters.categories.length > 0) {
      results = results.filter(p => _activeFilters.categories.includes(p.categoryId));
    }

    // Brand filter
    if (_activeFilters.brands.length > 0) {
      results = results.filter(p => _activeFilters.brands.includes(p.brand));
    }

    // Condition filter
    if (_activeFilters.conditions.length > 0) {
      results = results.filter(p => _activeFilters.conditions.includes(p.condition));
    }

    // Price filter
    results = results.filter(p => p.price >= _activeFilters.priceMin && p.price <= _activeFilters.priceMax);

    // Sort
    results = sortParts(results, _sortBy);

    _filtered = results;
    _currentPage = 1;
    return getPage(1);
  }

  function sortParts(parts, sortBy) {
    switch(sortBy) {
      case 'price_asc':   return [...parts].sort((a,b) => a.price - b.price);
      case 'price_desc':  return [...parts].sort((a,b) => b.price - a.price);
      case 'name_asc':    return [...parts].sort((a,b) => a.name.localeCompare(b.name));
      case 'newest':      return [...parts].sort((a,b) => b.id - a.id);
      default:            return parts; // relevance = original order
    }
  }

  // ─── Pagination ─────────────────────────────────────────
  function getPage(page) {
    _currentPage = page;
    const start = (page - 1) * PER_PAGE;
    return {
      items:      _filtered.slice(start, start + PER_PAGE),
      total:      _filtered.length,
      page:       _currentPage,
      totalPages: Math.ceil(_filtered.length / PER_PAGE),
      perPage:    PER_PAGE,
    };
  }

  function nextPage() { return getPage(Math.min(_currentPage + 1, Math.ceil(_filtered.length / PER_PAGE))); }
  function prevPage() { return getPage(Math.max(_currentPage - 1, 1)); }

  // ─── Filter setters ─────────────────────────────────────
  function setSort(sortBy) { _sortBy = sortBy; return applyFilters(); }
  function setSearch(q)    { _searchQuery = q.toLowerCase(); return applyFilters(); }

  function toggleFilter(type, value) {
    const arr = _activeFilters[type];
    if (!arr) return;
    const idx = arr.indexOf(value);
    if (idx > -1) arr.splice(idx, 1); else arr.push(value);
    return applyFilters();
  }

  function setPriceRange(min, max) {
    _activeFilters.priceMin = min || 0;
    _activeFilters.priceMax = max || Infinity;
    return applyFilters();
  }

  function clearFilters() {
    _activeFilters = { categories: [], brands: [], conditions: [], priceMin: 0, priceMax: Infinity };
    _sortBy = 'relevance';
    _searchQuery = '';
    return applyFilters();
  }

  /** Build facet counts for sidebar filters */
  function getFacets() {
    const brands = {}, conditions = {};
    _allParts.forEach(p => {
      brands[p.brand] = (brands[p.brand] || 0) + 1;
      conditions[p.condition] = (conditions[p.condition] || 0) + 1;
    });
    return { brands, conditions };
  }

  function getFilters() { return { ..._activeFilters }; }
  function getSortBy()  { return _sortBy; }

  return { loadParts, loadByCategory, search, getPage, nextPage, prevPage, setSort, setSearch, toggleFilter, setPriceRange, clearFilters, getFacets, getFilters, getSortBy };
})();

window.Catalog = Catalog;
