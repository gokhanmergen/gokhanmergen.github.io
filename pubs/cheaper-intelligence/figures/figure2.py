"""Figure 2: employment effects implied by AI's cost share.

Each line plots the cumulative change in industry employment,
    exp{[(sigma - eps)/(sigma - 1)] * ln(1 - s_M)} - 1,
as AI's cost share rises from zero to s_M (online Appendix A, equation A7),
holding the wage, labor productivity and the frontier of AI capabilities fixed.

Run:  python3 figure2.py      (writes figure2.pdf and figure2.png)
"""
import numpy as np
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

CASES = [  # (sigma, epsilon)
    (3.0, 0.5),
    (3.0, 2.0),
    (2.0, 3.0),
    (1.5, 3.0),
]
BAND = (1.0, 5.0)  # range of indicators of AI's current scale, percent


def employment_change(sigma, eps, share):
    """Percent change in employment as AI's cost share rises from 0 to `share`."""
    return (np.exp((sigma - eps) / (sigma - 1.0) * np.log(1.0 - share)) - 1.0) * 100.0


def main():
    s = np.linspace(0.0, 0.10, 201)
    fig, ax = plt.subplots(figsize=(7.6, 4.9))
    grey, ink, accent = "#5f5f5f", "#1f1f1f", "#2b6cb0"

    ax.axvspan(*BAND, color=accent, alpha=0.10, lw=0)
    ax.text(BAND[0] + 0.12, 38.5, "Current indicators of AI's scale\n(1 to 5 percent)",
            color=accent, fontsize=9, va="top")
    ax.axhline(0, color="#9a9a9a", lw=0.8)

    for sigma, eps in CASES:
        y = employment_change(sigma, eps, s)
        style = "-" if sigma > eps else (0, (5, 3))
        ax.plot(s * 100, y, color=grey, lw=2, linestyle=style)
        end = y[-1]
        ax.text(10.15, end + 0.6, f"σ = {sigma:g}, ε = {eps:g}", color=ink, fontsize=9, va="bottom")
        ax.text(10.15, end - 0.6, f"{end:+.1f} percent".replace("-", "−"), color=grey, fontsize=8.5, va="top")

    ax.set_xlim(0, 10)
    ax.set_ylim(-15, 40)
    ax.set_xticks(range(0, 11, 2))
    ax.set_yticks([-10, 0, 10, 20, 30, 40])
    ax.set_yticklabels(["−10", "0", "+10", "+20", "+30", "+40"])
    ax.set_xlabel("AI's share of production cost (percent)", color=grey)
    ax.set_ylabel("Change in employment (percent)", color=grey)
    ax.tick_params(colors=grey, length=0)
    ax.grid(axis="y", color="#e6e6e6", lw=0.8)
    for side in ("top", "right", "left", "bottom"):
        ax.spines[side].set_visible(False)

    ax.plot([], [], color=grey, lw=2, label="Solid: σ exceeds ε, so employment falls")
    ax.plot([], [], color=grey, lw=2, linestyle=(0, (5, 3)), label="Dashed: ε exceeds σ, so employment rises")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, 1.10), ncol=2, frameon=False, fontsize=8.5)

    fig.suptitle("Figure 2: Employment Effects Are Bounded by AI's Cost Share",
                 x=0.02, y=0.995, ha="left", fontsize=12.5, fontweight="bold", color=ink)
    fig.text(0.02, 0.925, "Change in industry employment implied by AI's share of production cost, "
             "for four combinations of σ and ε", fontsize=9.5, color=grey)
    fig.subplots_adjust(left=0.09, right=0.80, top=0.80, bottom=0.11)
    fig.savefig("figure2.pdf")
    fig.savefig("figure2.png", dpi=200)


if __name__ == "__main__":
    main()
