'use client';

import { useMemo, useState } from 'react';

type AdminCatalogCategoryFieldProps = {
  categories: string[];
  defaultValue?: string;
  suggestion?: string;
};

const NEW_CATEGORY_VALUE = '__new_category__';

export function AdminCatalogCategoryField({
  categories,
  defaultValue,
  suggestion,
}: AdminCatalogCategoryFieldProps) {
  const options = useMemo(() => normalizeCategoryOptions(categories, defaultValue), [categories, defaultValue]);
  const initialCategory = defaultValue?.trim() ?? '';
  const startsWithExisting = initialCategory ? options.includes(initialCategory) : options.length > 0;
  const [mode, setMode] = useState(initialCategory ? (startsWithExisting ? initialCategory : NEW_CATEGORY_VALUE) : '');
  const [newCategory, setNewCategory] = useState(startsWithExisting ? '' : initialCategory);
  const finalCategory = mode === NEW_CATEGORY_VALUE ? newCategory.trim() : mode;

  return (
    <div className="admin-user-field admin-user-field-wide">
      <span>Categoria publica</span>
      <input type="hidden" name="category" value={finalCategory} />
      <select value={mode} onChange={(event) => setMode(event.target.value)} aria-label="Categoria publica vista pelo cliente">
        <option value="" disabled>
          Selecione uma categoria publica
        </option>
        {options.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
        <option value={NEW_CATEGORY_VALUE}>Criar nova categoria</option>
      </select>
      {mode === NEW_CATEGORY_VALUE ? (
        <input
          type="text"
          value={newCategory}
          onChange={(event) => setNewCategory(event.target.value)}
          placeholder="Nova categoria publica"
          aria-label="Nova categoria publica"
        />
      ) : null}
      <small className="panel-meta">
        Categoria vista pelo cliente no catalogo e nos filtros.
        {suggestion ? ` Categoria do fornecedor apenas como referencia: ${suggestion}.` : ''}
      </small>
    </div>
  );
}

function normalizeCategoryOptions(categories: string[], defaultValue?: string) {
  return Array.from(
    new Set(
      [...categories, defaultValue]
        .map((category) => category?.trim())
        .filter((category): category is string => Boolean(category)),
    ),
  ).sort((left, right) => left.localeCompare(right, 'pt-BR'));
}
