import {ko, ok} from "../../fp/result.model.ts";

const isRepository: boolean = (dragee: Dragee) => dragee.kind_of === 'ddd/repository'
const isService: boolean = (dragee: Dragee) => dragee.kind_of === 'ddd/service'

const rule: RuleResult = (dragees: Dragee[]) => {
    const repositoryNames = dragees
        .filter(dragee => isRepository(dragee))
        .map(repository => repository.name)

    const drageesWithRepositoryDependencies = dragees.filter(dragee => {
        if (!dragee.depends_on) {
            return false
        }

        return Object.keys(dragee.depends_on)
            .filter(name => repositoryNames.includes(name))
            .length !== 0
    })

    return drageesWithRepositoryDependencies
        .map(dragee => {
            if (isService(dragee)) {
                return ok<boolean>(true)
            } else {
                return ko<boolean>(new Error(`The repository "ARepository" must not be a dependency of "${dragee.kind_of}"`))
            }
        })
}

export const RepositoryRule = {
    apply: rule
}