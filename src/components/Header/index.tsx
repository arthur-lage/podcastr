import styles from './styles.module.scss';
import ptBR from 'date-fns/locale/pt-BR';
import format from 'date-fns/format';

export function Header(){

    const currentData = format(new Date(), "EEEEEE, dd MMMM", {
        locale: ptBR,
    });

    return(
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="Podcastr"/>

            <p>O melhor para você ouvir, sempre</p>

            <span>{currentData}</span>
        </header>
    )
}