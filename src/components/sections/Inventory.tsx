import { skills } from "@/content/profile";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import styles from "./Inventory.module.css";

const pad = (n: number) => String(n).padStart(2, "0");
const countLabel = (n: number) => `${n} ${n === 1 ? "item" : "items"}`;

const total = skills.reduce((sum, group) => sum + group.items.length, 0);

/** § 05: the skills list, set as an evidence-inventory ledger (one hairline row per group). */
export function Inventory() {
  return (
    <section id="inventory" className="section" aria-labelledby="inventory-title">
      <div className="container">
        <SectionHeader
          index="05"
          label="Inventory"
          meta={countLabel(total)}
          title={
            <>
              The <em>toolkit</em> I build with
            </>
          }
          titleId="inventory-title"
        />

        <div className={`${styles.ledgerHead} label`} aria-hidden="true">
          <span>Ref. / Category</span>
          <span>Contents</span>
        </div>

        <ol className={styles.ledger}>
          {skills.map((group, i) => (
            <Reveal as="li" key={group.title} className={styles.row} delay={(i % 4) * 0.06} y={16}>
              <div className={styles.head}>
                <span className={styles.code}>INV-{pad(i + 1)}</span>
                <h3 className={styles.title}>{group.title}</h3>
                <span className={styles.count}>{countLabel(group.items.length)}</span>
              </div>
              <ul className={styles.items}>
                {group.items.map((item) => (
                  <li key={item}>
                    <Tag interactive>{item}</Tag>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
