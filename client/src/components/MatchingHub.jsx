import { useEffect, useState } from "react";
import { getNearbyOrganizations } from "../api/matching.api.js";
import { SectionHeader } from "./SectionHeader";
import { MatchCard } from "./MatchCard";

export function MatchingHub({ donations }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const donation = donations[0];

  useEffect(() => {
    if (!donation?._id) return;
    Promise.resolve().then(() => {
      setLoading(true);
      return getNearbyOrganizations(donation._id)
        .then((response) => setMatches(response.data || []))
        .catch((requestError) =>
          setError(
            requestError.response?.data?.message ||
              "Unable to load nearby organizations.",
          ),
        )
        .finally(() => setLoading(false));
    });
  }, [donation?._id]);

  return (
    <div className="animate-rise space-y-6">
      <section className="match-banner">
        <div>
          <p className="eyebrow text-[#a7d7c5]">Progressive matching</p>
          <h2 className="mt-2 font-display text-4xl tracking-[-0.04em] text-white">
            The right food, the right place.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#c2d5cc]">
            FoodBridge prioritizes distance, transport, and urgency for your
            nearby organization matches.
          </p>
        </div>
        <div className="radius-display">
          <span className="text-4xl font-bold">{matches.length}</span>
          <span className="text-xs text-[#acd4c5]">nearby matches</span>
        </div>
      </section>
      <section className="panel">
        <SectionHeader
          eyebrow="Best matches"
          title={`${matches.length} organizations nearby`}
        />
        <div className="mt-4 space-y-3">
          {loading && (
            <p className="text-sm text-[#718080]">
              Loading nearby organizations...
            </p>
          )}
          {!loading && !donation && (
            <p className="text-sm text-[#718080]">
              Create a donation to find nearby organizations.
            </p>
          )}
          {!loading && donation && matches.length === 0 && (
            <p className="text-sm text-[#718080]">
              No nearby organizations found.
            </p>
          )}
          {error && <p className="text-sm text-[#b96650]">{error}</p>}
          {matches.map((match, index) => (
            <MatchCard
              key={match._id}
              match={{
                ...match,
                name: match.organizationName || match.username,
                kind: match.organizationType || "Organization",
                distance: "Nearby",
                need: "Available",
                transport: match.hasTransport
                  ? "Own transport"
                  : "Volunteer needed",
                initials: (match.organizationName || match.username || "O")
                  .slice(0, 2)
                  .toUpperCase(),
                color: "bg-[#1d6b5d]",
              }}
              index={index}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
