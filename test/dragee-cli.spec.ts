import {expect, test, describe} from "bun:test";

const asserter = (dragees: Dragee[]) => {
    describe('Namespace: DDD', () => {
        test.each(dragees)('Dragee %p', (dragee: Dragee) => {
            expect(dragee).not.toBeUndefined();
        });

        describe('Check aggregate rules', () => {
            test.each(dragees)('Dragee %p', (dragee: Dragee) => {
                expect(dragee).not.toBeUndefined();
            });
        });
    })
}

asserter([{
    name: 'toto',
    kind_of: 'toto/titi',
    depends_on: []
}, {
    name: 'tutu',
    kind_of: 'toto/titi',
    depends_on: []
}]);