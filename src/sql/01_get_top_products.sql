CREATE OR REPLACE FUNCTION get_top_products(limit_count INT)
RETURNS TABLE (name TEXT, sales BIGINT, revenue NUMERIC)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.name,
    SUM(cp.quantite) AS sales,
    SUM(cp.quantite * cp.prix_unitaire) AS revenue
  FROM commande_produits AS cp
  JOIN products AS p ON cp.produit_id = p.id
  GROUP BY p.name
  ORDER BY sales DESC
  LIMIT limit_count;
END;
$$;
