export const TokenPerTokenPrice = ({ token1, token2, price }) => (
  <>
    <div className="price">
      <span>{price}</span>
      <span className="token-per-token">
        {token1} per {token2}
      </span>
    </div>
  </>
);
